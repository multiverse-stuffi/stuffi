import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

module.exports = withApiAuthRequired(async (req, res) => {
  const { user } = getSession(req, res);
  //validated user can view this page
  res.send(items);
});
