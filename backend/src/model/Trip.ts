export interface Trip {
    destination: string,
    starts_at: Date,
    ends_at: Date,
    owner_name: string,
    owner_email: string,
    emails_to_invite: string[]
}