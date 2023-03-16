// Success !!!

// User
export interface ApiUserProps {
    user: {
        _id: string,
        id: string,
        email: string,
        isDeleted: boolean,
        type: string,
        role: string,
        roleLabel: string,
        name: string,
        profile: string,
        createdAt: string,
        updatedAt: string
    },
    success: boolean
};

// Category
export interface ApiCategoryProps {
    category: [
        {
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
    ],
    success: boolean
};