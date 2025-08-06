export {
  UserForm,
  UserPermission,
  AccessToken,
  UserSelect,
  Group,
  GroupUser,
  Signup,
};

declare global {
  interface AccessToken extends Timestamp {
    ip: string;
  }

  interface Signup extends Username, PasswordConfirmation {
    fullName: string;
    phone: string;
  }

  interface UserPermission {
    permission: Permission;
  }
  interface UserForm extends ID, Me, PasswordConfirmation, Active {
    AccessTokens?: AccessToken[];
    UserPermissions?: UserPermission[];
  }

  interface UserSelect extends ID, FullName, Email {
    phone?: string;
  }

  interface GroupUser extends ID, Timestamp {
    user_id: number;
  }

  interface Group extends ID, Name, Timestamp {
    user_id?: number;
    User?: UserSelect;
    GroupUsers?: GroupUser[];
    Users?: UserSelect[];
  }
}
