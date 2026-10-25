
import { supabase } from "./supabase";

// Get the currently signed-in user's ID.
async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  if (!data.user) {
    throw new Error("Please sign in before accessing vouchers.");
  }

  return data.user.id;
}

// Fetch the signed-in employee's vouchers.
export async function getMyVouchers() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .eq("employee_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load my vouchers:", error.message);
    throw error;
  }

  console.log("My vouchers loaded:", data?.length ?? 0);
  return data ?? [];
}

// Create a voucher in Draft status.
export async function createDraftVoucher(voucher) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("vouchers")
    .insert({
      employee_id: userId,
      department: voucher.department,
      job_title: voucher.job_title,
      expense_date: voucher.expense_date,
      category: voucher.category,
      description: voucher.description,
      amount: Number(voucher.amount),
     
      employee_signature: voucher.employee_signature || null,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Submit a draft voucher for approval.

/**
 * Update an existing draft voucher.
 * Supabase RLS must verify ownership and Draft status.
 */
export async function updateDraftVoucher(voucherId, voucher) {
  if (!voucherId) {
    throw new Error("A voucher ID is required.");
  }

  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("vouchers")
    .update({
      department: voucher.department,
      job_title: voucher.job_title,
      expense_date: voucher.expense_date,
      category: voucher.category,
      description: voucher.description,
      amount: Number(voucher.amount),
      employee_signature: voucher.employee_signature || null,
    })
    .eq("id", voucherId)
    .eq("employee_id", userId)
    .eq("status", "draft")
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete an existing draft voucher.
 * Supabase RLS must verify ownership and Draft status.
 */
export async function deleteDraftVoucher(voucherId) {
  if (!voucherId) {
    throw new Error("A voucher ID is required.");
  }

  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("vouchers")
    .delete()
    .eq("id", voucherId)
    .eq("employee_id", userId)
    .eq("status", "draft")
    .select("id")
    .single();

  if (error) throw error;

  return data;
}

export async function submitVoucher(voucherId) {
  if (!voucherId) {
    throw new Error("A voucher ID is required.");
  }

  const { data, error } = await supabase.rpc("submit_voucher", {
    p_voucher_id: voucherId,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getAllVouchers() {
  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load all vouchers:", error.message);
    throw error;
  }

  return data ?? [];
}

export async function approveVoucher(voucherId, directorSignature) {
  if (!voucherId) {
    throw new Error("A voucher ID is required.");
  }

  if (!directorSignature?.trim()) {
    throw new Error("A director signature is required.");
  }

  const { error } = await supabase.rpc("approve_voucher", {
    p_voucher_id: voucherId,
    p_director_signature: directorSignature,
  });

  if (error) throw error;
}

export async function rejectVoucher(voucherId, rejectionReason) {
  if (!voucherId) {
    throw new Error("A voucher ID is required.");
  }

  if (!rejectionReason?.trim()) {
    throw new Error("Please enter a rejection reason.");
  }

  const { error } = await supabase.rpc("reject_voucher", {
    p_voucher_id: voucherId,
    p_rejection_reason: rejectionReason,
  });

  if (error) throw error;
}

export async function uploadDirectorSignature(file) {
  if (!file) {
    throw new Error("Please select a signature image.");
  }

  if (!["image/png", "image/jpeg"].includes(file.type)) {
    throw new Error("Please select a PNG or JPEG image.");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("The signature image must be 2 MB or smaller.");
  }

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  if (!userData.user) {
    throw new Error("Please sign in first.");
  }

  const filePath =
    `${userData.user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const { error: uploadError } = await supabase.storage
    .from("voucher-signatures")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  return filePath;
}

export async function getSignatureUrl(filePath) {
  if (!filePath) {
    throw new Error("Signature path is empty.");
  }

  console.log("Requesting signature URL for:", filePath);

  const { data, error } = await supabase.storage
    .from("voucher-signatures")
    .createSignedUrl(filePath, 300);

  if (error) {
    console.error("Signed URL error:", error);
    throw error;
  }

  console.log("Signed URL created successfully.");
  return data.signedUrl;
}
