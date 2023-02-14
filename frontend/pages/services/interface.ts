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

// Category
export interface CategoryProps {
    _id:        string,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  boolean,

    name:       string,
    label:      string,
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
            content: string
            image: string
            tag: string[]
            createdAt: string
            updatedAt: string
        }
    ]
};
export interface PostProps {
    _id: string
    id: number
    title: string
    content: string
    image: string
    tag: string[]
    createdAt: string
    updatedAt: string
};