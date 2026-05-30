import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
export const signUp = (email, password) => supabase.auth.signUp({ email, password })
export const signOut = () => supabase.auth.signOut()

// Database helpers
export const getLines = () => supabase.from('production_lines').select('*, facilities(name)').order('name')
export const getAreas = (lineId) => supabase.from('areas').select('*').eq('line_id', lineId).order('name')
export const getChecklist = (areaId, phase) => supabase.from('checklist_templates').select('*').eq('area_id', areaId).eq('phase', phase).order('sequence_order')
export const getAssignments = (lineId, shift) => supabase.from('assignments').select('*, profiles(full_name)').eq('line_id', lineId).eq('shift', shift)
export const createAssignment = (assignment) => supabase.from('assignments').insert(assignment)
export const updateAssignment = (id, update) => supabase.from('assignments').update(update).eq('id', id)
export const submitChecklistResponse = (response) => supabase.from('checklist_responses').insert(response)
export const createDamageReport = (report) => supabase.from('damage_reports').insert(report)
export const getDamageReports = (lineId) => supabase.from('damage_reports').select('*, profiles(full_name)').eq('line_id', lineId).order('created_at', { ascending: false })
export const resolveDamageReport = (id) => supabase.from('damage_reports').update({ status: 'resolved', resolved_at: new Date() }).eq('id', id)
export const createFinding = (finding) => supabase.from('findings').insert(finding)
export const getFindings = (lineId) => supabase.from('findings').select('*, profiles(full_name)').eq('line_id', lineId).order('created_at', { ascending: false })
export const createVerification = (verification) => supabase.from('area_lead_verifications').insert(verification)
export const logActivity = (log) => supabase.from('activity_logs').insert(log)
export const getDashboardStats = async (lineId) => {
  // Get counts for dashboard
  const [areasRes, assignmentsRes, damageRes, findingsRes] = await Promise.all([
    supabase.from('areas').select('id, name, status, locked_by, locked_at').eq('line_id', lineId),
    supabase.from('assignments').select('*').eq('line_id', lineId).eq('date', new Date().toISOString().split('T')[0]),
    supabase.from('damage_reports').select('id, status').eq('line_id', lineId),
    supabase.from('findings').select('id, status').eq('line_id', lineId)
  ])
  return {
    areas: areasRes.data || [],
    assignments: assignmentsRes.data || [],
    damageReports: damageRes.data || [],
    findings: findingsRes.data || []
  }
}

// Realtime subscriptions
export const subscribeToLine = (lineId, callback) => {
  return supabase
    .channel(`line-${lineId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'production_lines', filter: `id=eq.${lineId}` }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments', filter: `line_id=eq.${lineId}` }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'damage_reports', filter: `line_id=eq.${lineId}` }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'findings', filter: `line_id=eq.${lineId}` }, callback)
    .subscribe()
}
