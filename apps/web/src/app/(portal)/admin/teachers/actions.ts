'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveTeacher(teacherId: string) {
  const supabase = await createClient()

  // Verify caller is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (profile?.role !== 'admin') {
    throw new Error("Only admins can approve teachers")
  }

  const { error } = await supabase
    .from('teacher_details')
    .update({ status: 'approved' })
    .eq('id', teacherId)

  if (error) {
    console.error("Failed to approve teacher", error)
    throw new Error("Failed to approve teacher")
  }

  revalidatePath('/admin/teachers')
}

export async function rejectTeacher(teacherId: string, reason: string) {
  const supabase = await createClient()

  // Verify caller is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (profile?.role !== 'admin') {
    throw new Error("Only admins can reject teachers")
  }

  const { error } = await supabase
    .from('teacher_details')
    .update({ status: 'rejected', admin_notes: reason })
    .eq('id', teacherId)

  if (error) {
    console.error("Failed to reject teacher", error)
    throw new Error("Failed to reject teacher")
  }

  revalidatePath('/admin/teachers')
}
