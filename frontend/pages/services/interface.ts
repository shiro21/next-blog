// User
export interface RegisterProps {
    _id: string,
    id: string,
    email: string,
    password: string,
    passwordConfirm: string,
    type: string,
    role: string,
    roleLabel: string,
    name: string,
    profile: string,
    createdAt: string,
    updatedAt: string
};
export interface LoginProps {
    id: string,
    password: string
};
export interface UserProps {
    _id:        string,
    createdAt:  string,
    updatedAt:  string,
    isDeleted:  boolean,
    id:         string,
    email:      string,
    type:       string,
    role:       string,
    roleLabel:  string,
    name:       string,
    profile:    string
}

// Category
export interface CategoryProps {
    _id:        string,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  boolean,

    name:       string,
    label:      string,
    subLabel:   string,
    priority:   number,
    entries:    number,
    depth:      number,
    parent:     string,
    categoryInfo: {
        image: "",
        description: ""
    },
    opened:     boolean,
    updateData: boolean,
    leaf:       boolean,
    children:   []
}
export interface SubCategoryProps {
    _id:        string,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  boolean,

    name:       string,
    label:      string,
    subLabel:   string,
    priority:   number,
    entries:    number,
    depth:      number,
    parent:     string,
    categoryInfo: {
        image: "",
        description: ""
    },
    opened:     boolean,
    updateData: boolean,
    leaf:       boolean
}

// Post
export interface PostListsProps {
    post: [
        {
            _id: string
            id: number
            title: string
            edit: string
            image: string
            tag: string[]
            createdAt: string
            updatedAt: string
        }
    ]
};
export interface PostProps {
    label: string,
    subLabel: string,
    _id: string,
    title: string,
    edit: string,
    image: string,
    tag: string[],
    createdAt: string,
    updatedAt: string,
    owner: {
        id:         string,
        email:      string,
        type:       string,
        role:       string,
        roleLabel:  string,
        name:       string,
        profile:    string
    }
};

// Comment
export interface CommentProps {
    _id:        string,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  boolean,

    nick:       string,
    password:   string,
    comment:    string,
    secret:     boolean,
    owner:      string
}

// UserAgent
export interface UserAgentProps {
    _id:            string,
    updatedAt:      Date,
    createdAt:      Date,

    write:          string,
    userAgent:      string,
}