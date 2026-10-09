import { AccessToken } from 'livekit-server-sdk';

export async function createLivekitToken(
  roomName: string, 
  participantName: string, 
  participantIdentity: string
) {
  // if this room doesn't exist, it'll be automatically created when the first
  // client joins
  
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set');
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: participantName,
  });

  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
}
