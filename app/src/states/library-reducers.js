const initLibraryState = {
    edit: false,
    select: [],
};

export function library(state = initLibraryState, action) {
    let S;
    switch (action.type) {
        case '@LIBRARY/SET_EDIT':
            return {
                ...state,
                edit: action.edit
            };
        case '@LIBRARY/ADD_SELECT':
            S = state.select.slice();
            S.push(action.bookPath);

            return {
                ...state,
                select: S
            };
        case '@LIBRARY/CANCEL_SELECT':
            S = state.select.slice();
            let i = S.indexOf(action.bookPath);
            if (i > -1) {
                S.splice(i, 1);
            }

            return {
                ...state,
                select: S
            };
        case '@LIBRARY/CANCEL_ALL_SELECT':
            return {
                ...state,
                select: []
            };
        default: 
            return state;
    }
}