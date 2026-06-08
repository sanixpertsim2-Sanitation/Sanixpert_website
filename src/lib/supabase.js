import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Photo Upload ──

export const uploadPhoto = async (file, bucket = 'verification-photos') => {
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { contentType: file.type })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return publicUrl
}

// ── Areas (called "lines" in the UI) ──

export const getLines = async () => {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data || []
}

// ── Checklist Templates ──

export const getChecklist = async (areaId, phase) => {
  const { data, error } = await supabase
    .from('checklist_templates')
    .select('*')
    .eq('area_id', areaId)
    .eq('phase', phase)
    .order('step_number')
  if (error) throw error
  return data || []
}

// ── Pre-Cleaning Logs ──

export const insertPreCleanLog = async (log) => {
  const { data, error } = await supabase
    .from('pre_cleaning_logs')
    .insert(log)
    .select()
  if (error) throw error
  return data?.[0]
}

export const getPreCleanLogs = async (lineId) => {
  const { data, error } = await supabase
    .from('pre_cleaning_logs')
    .select('*')
    .eq('line_id', lineId)
    .order('completed_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ── Post-Cleaning Logs ──

export const insertPostCleanLog = async (log) => {
  const { data, error } = await supabase
    .from('post_cleaning_logs')
    .insert(log)
    .select()
  if (error) throw error
  return data?.[0]
}

export const getPostCleanLogs = async (lineId) => {
  const { data, error } = await supabase
    .from('post_cleaning_logs')
    .select('*')
    .eq('line_id', lineId)
    .order('completed_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ── Damage Reports ──

export const insertDamageReport = async (report) => {
  const { data, error } = await supabase
    .from('damage_reports')
    .insert(report)
    .select()
  if (error) throw error
  return data?.[0]
}

export const getDamageReports = async (lineId) => {
  const { data, error } = await supabase
    .from('damage_reports')
    .select('*')
    .eq('line_id', lineId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export const updateDamageReport = async (id, updates) => {
  const { data, error } = await supabase
    .from('damage_reports')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data?.[0]
}

// ── Handover Tasks ──

export const insertHandoverTask = async (task) => {
  const { data, error } = await supabase
    .from('handover_tasks')
    .insert(task)
    .select()
  if (error) throw error
  return data?.[0]
}

export const getHandoverTasks = async (lineId) => {
  const { data, error } = await supabase
    .from('handover_tasks')
    .select('*')
    .eq('line_id', lineId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export const updateHandoverTask = async (id, updates) => {
  const { data, error } = await supabase
    .from('handover_tasks')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data?.[0]
}

// ── Area Inspection Logs ──

export const insertInspectionLog = async (log) => {
  const { data, error } = await supabase
    .from('area_inspection_logs')
    .insert(log)
    .select()
  if (error) throw error
  return data?.[0]
}

export const getInspectionLogs = async (lineId) => {
  const { data, error } = await supabase
    .from('area_inspection_logs')
    .select('*')
    .eq('line_id', lineId)
    .order('completed_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ── Line Release Logs ──

export const insertReleaseLog = async (log) => {
  const { data, error } = await supabase
    .from('line_release_logs')
    .insert(log)
    .select()
  if (error) throw error
  return data?.[0]
}

export const getReleaseLogs = async (lineId) => {
  const { data, error } = await supabase
    .from('line_release_logs')
    .select('*')
    .eq('line_id', lineId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ── Dashboard Stats ──

export const getDashboardStats = async () => {
  const [areasRes, preCleanRes, postCleanRes, damageRes, handoverRes, releaseRes] = await Promise.all([
    supabase.from('areas').select('id, name, side'),
    supabase.from('pre_cleaning_logs').select('line_id, completed_at'),
    supabase.from('post_cleaning_logs').select('line_id, completed_at'),
    supabase.from('damage_reports').select('id, line_id, status'),
    supabase.from('handover_tasks').select('id, line_id, status'),
    supabase.from('line_release_logs').select('line_id, created_at')
  ])
  return {
    areas: areasRes.data || [],
    preCleanLogs: preCleanRes.data || [],
    postCleanLogs: postCleanRes.data || [],
    damageReports: damageRes.data || [],
    handoverTasks: handoverRes.data || [],
    releaseLogs: releaseRes.data || []
  }
}
