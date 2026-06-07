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

// getChecklist by lineId (fetches all areas for the line)
export const getChecklist = (lineId, phase) =>
  supabase
    .from('checklist_templates')
    .select('*, areas!inner(line_id)')
    .eq('areas.line_id', lineId)
    .eq('phase', phase)
    .order('step_number', { ascending: true })

// Upload photo to Supabase Storage
export const uploadPhoto = async (file) => {
  if (!file) return null
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
  const { data, error } = await supabase.storage
    .from('verification-photos')
    .upload(fileName, file, { contentType: 'image/jpeg' })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('verification-photos').getPublicUrl(data.path)
  return publicUrl
}

// Insert pre-clean log (batch insert checklist responses)
export const insertPreCleanLog = (responses) =>
  supabase.from('checklist_responses').insert(responses)

// Insert post-clean log (batch insert checklist responses)
export const insertPostCleanLog = (responses) =>
  supabase.from('checklist_responses').insert(responses)

// Insert damage report
export const insertDamageReport = (report) =>
  supabase.from('damage_reports').insert(report)
export const getAreas = (lineId) => supabase.from('areas').select('*').eq('line_id', lineId).order('name')
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

// Handover tasks
export const getHandoverTasks = (lineId) =>
  supabase.from('handover_tasks').select('*').eq('line_id', lineId).order('created_at', { ascending: false })

export const updateHandoverTask = (id, update) =>
  supabase.from('handover_tasks').update(update).eq('id', id)

export const insertHandoverTask = (task) =>
  supabase.from('handover_tasks').insert(task)

// Generic damage report update
export const updateDamageReport = (id, update) =>
  supabase.from('damage_reports').update(update).eq('id', id)

// Inspection log (area lead verification)
export const insertInspectionLog = (log) =>
  supabase.from('inspection_logs').insert(log)

// Release log
export const insertReleaseLog = (log) =>
  supabase.from('release_logs').insert(log)

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
