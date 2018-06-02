declare var module: any;

import log4js = require('log4js');
let logger = log4js.getLogger("boot");


class InitSecurity {
	private User;
	private Role;
	private RoleMapping;

	constructor(app) {
		this.User = app.models.User;
		this.Role = app.models.Role;
		this.RoleMapping = app.models.RoleMapping;
	};

	public init() {
		// find admin in db
		this.User.findOne({where: {username: 'admin'}}).then((user) => {
			if(!user) {
				// create user if not already exists
				this.User.create({username: 'admin', email: 'admin@loclaserver.de', password: 'admin'}).then((user) => {
					if(user) {
						logger.debug(`User created: ${JSON.stringify(user.toJSON())}`);
						this.initRoleForUser(user);
					} else {
						logger.error(`user 'admin' could not be created. Program may not work as expected`);
					}
				});
			} else {
				this.initRoleForUser(user);
			}
		}).catch((err) => {
			logger.error(`error: ${err}`);
		});
	};

	/**
	 * creates the role r_admin_access that grants access to the all models and assign it to
	 * the passed user
	 * @param user user to assign the role to
	 */
	private initRoleForUser(user:any) {
		this.Role.findOne({where: {name: 'r_admin_access'}, include: 'principals'}).then((role) => {
			if(!role) {
				this.Role.create({name: 'r_admin_access', description: 'grants general access to admin'}).then((role) => {
					if(role) {
						logger.debug(`Role created: ${JSON.stringify(role.toJSON())}`);
						this.assignUserToRole(user, role);
					} else {
						logger.error(`role 'r_admin_access' could not be created. Program may not work as expected`);
					}
				})
			} else {
				this.assignUserToRole(user, role);
			}
		})
	}

	/**
	 * assigns the passed user to the passed role if not already done
	 * @param user user to assign to the role
	 * @param role role the user to assign to
	 */
	private assignUserToRole(user, role) {
		// Promise (then) does not work here
		this.RoleMapping.findOne({where: {
        principalType: this.RoleMapping.USER, principalId: user.id, roleId: role.id}}).then((roleMapping) => {
			if(!roleMapping) {
				role.principals.create({
					principalType: this.RoleMapping.USER,
					principalId: user.id
				}).then((roleMapping) => {
					logger.debug(`Rolemapping created: ${JSON.stringify(roleMapping.toJSON())}`);
				})
			}
		})
	}


}

module.exports = function initial_security(app) {
	logger.debug(`starting initial_security script`);
	let initSecurity:InitSecurity = new InitSecurity(app);
	initSecurity.init();
};
