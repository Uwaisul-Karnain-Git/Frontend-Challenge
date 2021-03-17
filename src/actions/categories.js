import { categories } from '../Resources/response';


export const getCategories = () => (dispatch) => {
    let tempCategories = [];
    for(let cat of categories) {
        let tempCategory = { ...cat, isDisplayed: false, isChecked: false };
        tempCategories.push(tempCategory);
    }
    const data = tempCategories;
    
    dispatch({ type: 'GET_ALL_PRODUCTS', payload: data });
};
