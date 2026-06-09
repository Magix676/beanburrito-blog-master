export interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    global_name: string;
    avatar: string;
    email: string;
    verified: boolean;
    locale: string;
    mfa_enabled: boolean;
    flags: number;
    premium_type: number;
    public_flags: number;
}