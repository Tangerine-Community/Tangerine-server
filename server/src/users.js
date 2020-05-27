const fs = require('fs-extra');
const util = require('util');
const junk = require('junk');
const {
  doesUserExist,
  hashPassword,
  USERS_DB,
  isSuperAdmin,
  findUserByUsername,
} = require('./auth');

const registerUser = async (req, res) => {
  try {
    if (!(await doesUserExist(req.body.username))) {
      const user = req.body;
      user.isActive = true;
      user.password = await hashPassword(user.password);
      user.groups = [];
      const data = await USERS_DB.post(user);
      res.send({ statusCode: 200, data });
      return data;
    }
  } catch (error) {
    res.send('Could Not Create user');
  }
};

const getAllUsers = async (req, res) => {
  const result = await USERS_DB.allDocs({ include_docs: true });
  const data = result.rows
    .map(doc => doc)
    .filter(doc => !doc['id'].startsWith('_design'))
    .map(doc => {
      const user = doc['doc'];
      return {
        _id: user._id,
        email: user.email,
        isActive: user.isActive,
        username: user.username,
      };
    });
  res.send({ statusCode: 200, data });
};

const getUserByUsername = async (req, res) => {
  const username = req.params.username;
  try {
    await USERS_DB.createIndex({ index: { fields: ['username'] } });
    const results = await USERS_DB.find({
      selector: { username: { $regex: `(?i)${username}` } },
    });
    const data = results.docs.map(user => user.username);
    res.send({ data, statusCode: 200, statusMessage: 'Ok' });
  } catch (error) {
    res.sendStatus(500);
  }
};

const checkIfUserExistByUsername = async (req, res) => {
  try {
    const data = await doesUserExist(req.params.username);
    if (!data) {
      res.send({ statusCode: 200, data: !!data });
    } else {
      res.send({ statusCode: 409, data: !!data });
    }
  } catch (error) {
    // In case of error assume user exists. Helps avoid same username used multiple times
    res.send({ statusCode: 500, data: true });
  }
};

const isUserSuperAdmin = async (req, res) => {
  try {
    const data = await isSuperAdmin(req.params.username);
    res.send({ data, statusCode: 200, statusMessage: 'ok' });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const isUserAnAdminUser = async (req, res) => {
  try {
    const data = await isAdminUser(req.params.username);
    res.send({ data, statusCode: 200, statusMessage: 'ok' });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// If is not admin, return false else return the list of the groups to which user isAdmin
async function isAdminUser(username) {
  try {
    const groups = await getGroupsByUser(username);
    let data = groups.filter(group => group.attributes.role === 'admin');
    if (data.length < 1) {
      data = false;
    }
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getGroupsByUser(username) {
  if (await isSuperAdmin(username)) {
    const readdirPromisified = util.promisify(fs.readdir);
    const files = await readdirPromisified('/tangerine/client/content/groups');
    let filteredFiles = files
      .filter(junk.not)
      .filter(name => name !== '.git' && name !== 'README.md');
    let groups = [];
    groups = filteredFiles.map(groupName => {
      return {
        attributes: {
          name: groupName,
          role: 'admin',
        },
      };
    });
    return groups;
  } else {
    const user = await findUserByUsername(username);
    let groups = [];
    if (typeof user.groups !== 'undefined') {
      groups = user.groups.map(group => {
        return {
          attributes: {
            name: group.groupName,
            role: group.role,
          },
        };
      });
    }
    return groups;
  }
}

const deleteUser = async (req, res) => {
  try {
    const username = req.params.username;
    if (username) {
      const user = await findUserByUsername(username);
      user['isActive'] = false;
      const data = await USERS_DB.put(user);
      res.status(200).send({
        data,
        statusCode: 200,
        statusMessage: `User Deleted Successfully`,
      });
    } else {
      res.status(500).send({ data: `Could not Delete User` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ data: `Could not Delete User` });
  }
};

module.exports = {
  checkIfUserExistByUsername,
  deleteUser,
  getAllUsers,
  getGroupsByUser,
  getUserByUsername,
  isUserAnAdminUser,
  isUserSuperAdmin,
  registerUser,
};
