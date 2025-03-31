import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  console.log('API /auth/session запрошен', { 
    hasSession: !!session, 
    sessionUserId: session?.user?.id 
  });

  if (session) {
    // Возвращаем данные сессии, если пользователь аутентифицирован
    return res.status(200).json({
      authenticated: true,
      user: session.user,
      expires: session.expires
    });
  } else {
    // Возвращаем информацию о том, что пользователь не аутентифицирован
    return res.status(200).json({
      authenticated: false
    });
  }
} 