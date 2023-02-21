import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';

const secretHandler = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    res.end(
      `Welcome to the VIP Club, ${
        session.user.name || session.user.email
      }!`
    );
  } else {
    res.statusCode = 403;
    res.end("Hold on, you're not allowed in here!");
  }
};

export default secretHandler;
