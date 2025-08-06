export {
  ListPage,
  AvatarImage,
  DefaultSelectOptions,
  NavigationLinkItem,
  ID,
  Name,
  FullName,
  Active,
  Timestamp,
  AttachFile,
  RelateAttachFile,
  Img,
  Search,
  ContactUs,
};

declare global {
  interface ListPage<R> {
    totalItems: number;
    rows: R[];
    totalPages: number;
    currentPage: number;
  }

  interface DataEncryption {
    data: string;
    key?: string;
  }

  interface AvatarImage {
    src: string;
  }
  interface ID {
    id?: number;
  }
  interface Token {
    token?: string;
  }
  interface Name extends ID {
    name: string;
  }

  interface FullName {
    prename?: string;
    firstname: string;
    lastname: string;
  }

  interface Active {
    active?: boolean;
  }
  interface Used {
    is_used?: boolean;
  }
  interface Timestamp {
    createdAt?: string;
    updatedAt?: string;
  }

  interface DefaultSelectOptions {
    label: string | number;
    value?: string | number;
  }

  interface NavigationLinkItem {
    label: string;
    title?: string;
    subtitle?: string;
    detail?: string;
    to?: RouteLocationRaw;
    icon?: string;
    badge?: number;
    avatar?: AvatarImage;
    background?: string;
    roles?: Role[];
    permissions?: Permission[];
    user_type?: UserType;
    slot?: const;
    auth?: boolean;
  }

  interface Img extends ID {
    url: string;
  }
  interface AttachFile extends ID, Img {
    id: number;
    name: string;
    file_type?: FileType;
  }
  interface RelateAttachFile extends ID, Timestamp {
    AttachFile: AttachFile;
  }

  interface Search {
    search: string;
  }
  interface ContactUs extends Name, Email {
    title: string;
    note: string;
    token?: string;
  }
}
