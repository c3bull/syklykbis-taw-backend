import PasswordDAO from '../DAO/passwordDAO';
import TokenDAO from '../DAO/tokenDAO';
import UserDAO from '../DAO/userDAO';
import applicationException from '../service/applicationException';
import sha1 from 'sha1';

function create(context) {

  function hashString(password) {
    return sha1(password);
  }

  async function authenticate(email, password) {
    let userData;
    const user = await UserDAO.getByEmailOrName(email);
    if (!user) {
      throw applicationException.new(applicationException.UNAUTHORIZED, 'User with that email does not exist');
    }
    userData = await user;
    await PasswordDAO.authorize(user.id, hashString(password));
    const token = await TokenDAO.create(userData);
    return getToken(token);
  }

  function getToken(token) {
    return {token: token.value};
  }

  async function removeUserByEmail(email) {
    return await UserDAO.removeByEmail(email);
  }

  async function createNewOrUpdate(userData) {
    const user = await UserDAO.createNewOrUpdate(userData);
    if (await userData.password) {
      return await PasswordDAO.createOrUpdate({userId: user.id, password: hashString(userData.password)});
    } else {
      return user;
    }
  }

  async function removeHashSession(userId) {
    return await TokenDAO.remove(userId);
  }

  async function changePassword(userId, oldPassword, newPassword) {
    return await PasswordDAO.changePassword(userId, hashString(oldPassword), hashString(newPassword));
  }

  return {
    hashString: hashString,
    authenticate: authenticate,
    createNewOrUpdate: createNewOrUpdate,
    removeHashSession: removeHashSession,
    removeUserByEmail: removeUserByEmail,
    changePassword: changePassword,
  };
}

export default {
  create: create
};
