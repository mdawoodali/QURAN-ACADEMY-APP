/**
 * Child Safety, COPPA Compliance & Safeguarding Policy Enforcement
 * Mandated for all Academy live classroom sessions, tutor assignments, and portal views.
 */

export interface StudentProfileData {
  id: string;
  firstName: string;
  lastName: string;
  fatherName?: string;
  age: number;
  country: string;
  city: string;
  postalCode?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
  guardianConsentRecorded: boolean;
}

export type SafeStudentView = Omit<
  StudentProfileData,
  "phoneNumber" | "email" | "address" | "postalCode"
> & {
  phoneNumber?: string;
  email?: string;
  address?: string;
  postalCode?: string;
  isPiiMasked: boolean;
};

/**
 * Mask sensitive student PII from unauthorized or teacher viewers
 */
export function maskStudentPii(
  data: StudentProfileData,
  viewerRole: "teacher" | "student" | "parent" | "admin"
): SafeStudentView {
  // Admins and direct parents have authorized access to unmasked contact info
  if (viewerRole === "admin" || viewerRole === "parent") {
    return {
      ...data,
      isPiiMasked: false,
    };
  }

  // Teachers and peer viewers strictly receive masked educational attributes
  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName[0] ? `${data.lastName[0]}.` : "",
    age: data.age,
    country: data.country,
    city: data.city,
    guardianConsentRecorded: data.guardianConsentRecorded,
    phoneNumber: "REDACTED_SAFEGUARDED",
    email: "REDACTED_SAFEGUARDED",
    address: "REDACTED_SAFEGUARDED",
    postalCode: "REDACTED_SAFEGUARDED",
    isPiiMasked: true,
  };
}

/**
 * Enforce parental consent-gated recording policy
 * Under UK/US child safety laws, recording is prohibited unless explicit parental consent is active.
 */
export function isRecordingPermitted(guardianConsentRecorded: boolean): boolean {
  return guardianConsentRecorded === true;
}

/**
 * In-memory schedule overlap validator for double-booking prevention
 */
export function hasScheduleCollision(
  existingSlots: { startTime: string; endTime: string }[],
  candidateStart: string,
  candidateEnd: string
): boolean {
  const newStart = new Date(candidateStart).getTime();
  const newEnd = new Date(candidateEnd).getTime();

  if (newStart >= newEnd) {
    throw new Error("Invalid schedule range: start time must precede end time");
  }

  return existingSlots.some((slot) => {
    const slotStart = new Date(slot.startTime).getTime();
    const slotEnd = new Date(slot.endTime).getTime();

    // Overlap condition: (StartA < EndB) and (EndA > StartB)
    return newStart < slotEnd && newEnd > slotStart;
  });
}
