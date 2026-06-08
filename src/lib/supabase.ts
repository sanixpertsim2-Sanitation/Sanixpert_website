import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ujirzdzxlcejknkfbeom.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaXJ6ZHp4bGNlamtua2ZiZW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTExNzEsImV4cCI6MjA5NTY4NzE3MX0.YobRyxsN18W4YtzTrvefNI6EkuCCldE_3OouADzme5s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const MACY_LINE_ID = '1b21b26e-0a40-4533-9332-7d5f531eea1a';

export interface Area {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  area_id: string;
  phase: 'pre_cleaning' | 'post_cleaning';
  step_number: number;
  title: string;
  description: string;
  requires_photo: boolean;
}

export interface CleaningSession {
  id?: string;
  area_id: string;
  employee_name: string;
  shift: string;
  status: 'in_progress' | 'pre_done' | 'post_done' | 'handover' | 'verified' | 'released';
  created_at?: string;
}

export interface Response {
  id?: string;
  session_id: string;
  item_id: string;
  response: 'acceptable' | 'not_acceptable' | 'na';
  photo_url?: string;
  notes?: string;
  created_at?: string;
}

export interface DamageReport {
  id?: string;
  session_id: string;
  item_title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  photo_url?: string;
  status: 'open' | 'repaired' | 'handed_over';
  created_at?: string;
}

export interface HandoverTask {
  id?: string;
  session_id: string;
  task_description: string;
  source: 'damage' | 'not_acceptable';
  status: 'open' | 'completed';
  completed_by?: string;
  completed_at?: string;
  created_at?: string;
}

export interface VerificationLog {
  id?: string;
  session_id: string;
  verifier_name: string;
  signature_data: string;
  status: 'verified' | 'rejected';
  notes?: string;
  created_at?: string;
}

export async function uploadPhoto(file: File, bucket = 'verification-photos'): Promise<string> {
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
  const { error } = await supabase.storage.from(bucket).upload(fileName, file, { contentType: file.type });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return publicUrl;
}

export async function getAreas(): Promise<Area[]> {
  const { data, error } = await supabase.from('areas').select('*').order('sort_order');
  if (error) throw error;
  return data || [];
}

export async function getChecklistItems(areaId: string, phase: 'pre_cleaning' | 'post_cleaning'): Promise<ChecklistItem[]> {
  const { data, error } = await supabase.from('checklist_items').select('*').eq('area_id', areaId).eq('phase', phase).order('step_number');
  if (error) throw error;
  return data || [];
}

export async function createSession(session: CleaningSession): Promise<CleaningSession> {
  const { data, error } = await supabase.from('cleaning_sessions').insert(session).select().single();
  if (error) throw error;
  return data;
}

export async function updateSessionStatus(sessionId: string, status: string) {
  const { error } = await supabase.from('cleaning_sessions').update({ status }).eq('id', sessionId);
  if (error) throw error;
}

export async function saveResponse(response: Response) {
  const { error } = await supabase.from('responses').insert(response);
  if (error) throw error;
}

export async function createDamageReport(report: DamageReport) {
  const { error } = await supabase.from('damage_reports').insert(report);
  if (error) throw error;
}

export async function getDamageReports(sessionId: string): Promise<DamageReport[]> {
  const { data, error } = await supabase.from('damage_reports').select('*').eq('session_id', sessionId);
  if (error) throw error;
  return data || [];
}

export async function createHandoverTask(task: HandoverTask) {
  const { error } = await supabase.from('handovers').insert(task);
  if (error) throw error;
}

export async function getHandoverTasks(sessionId: string): Promise<HandoverTask[]> {
  const { data, error } = await supabase.from('handovers').select('*').eq('session_id', sessionId);
  if (error) throw error;
  return data || [];
}

export async function createVerificationLog(log: VerificationLog) {
  const { error } = await supabase.from('verification_logs').insert(log);
  if (error) throw error;
}
