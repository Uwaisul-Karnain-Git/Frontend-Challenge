import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from '../actions/categories';
import Category from './Category';

const Categories = () => {

    let orgCategories = useSelector(state => state.categories);
    const dispatch = useDispatch();
    const [categories, setCategories] = useState(() => []);
    const [selectedCategories, setSelectedCategories] = useState(() => []);

    const toggleCategory = (id) => {

        const updatedCategories = categories.map(cat => {

            if(id !== '-1') {   // To ignore 'Select All's
                if(cat.parent === id) {
                    cat.isDisplayed = !cat.isDisplayed;

                    if(!cat.isDisplayed) {
                        // Hide Children
                        categories.filter(c => c.parent === cat.id).map(c => c.isDisplayed = false);

                        // Hide Grand Childrens
                        let grandChildCategories = categories.filter(c => c.parent === cat.id).map(c => {
                            return categories.filter(o => o.parent === cat.id);
                        });
                        grandChildCategories.map(g => g.map(gc => categories.filter(c => c.parent === gc.id)
                            .map(c => c.isDisplayed = false)));
                    }
                }
            }
            return cat;
          });

          setCategories(() => [...updatedCategories]);
    };

    const checkCategory = (id, selectAllItem) => {
        const parentId = selectAllItem.parent;
        const isChecked = selectAllItem.isChecked;
        const checkedCategories = [];

        const updatedCategories = categories.map(cat => {

            if(cat.id === id && id !== '-1') {
                cat.isChecked = !cat.isChecked;
            }

            // 'Select All' Checkboxes
            if(id === '-1') {                
                if(cat.parent === parentId){
                    cat.isChecked = !isChecked;
                }
            }

            // Get 'Selected Categories'
            if(cat.isChecked) {
                if(cat.id !== '-1') {    // ignore 'Select All'
                    checkedCategories.push(cat.name);
                }
            }
            return cat;
          });

          checkedCategories.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

          setCategories(() => [...updatedCategories]);
          setSelectedCategories(() => [...checkedCategories]);
    };

    const removeCategory = (cat) => {
        const removeItemItem = selectedCategories.indexOf(cat);
        let updatedSelectedCategories = [...selectedCategories];        
        updatedSelectedCategories.splice(removeItemItem, 1);
        setSelectedCategories(() => [...updatedSelectedCategories]);

        // uncheck removed category
        categories.map(c => {
            if(c.name === cat){
                c.isChecked = false;
            }
            return c;
        });
    };

    const onClickRemoveAllSelections = () => {
        const updatedCategories = categories.map(cat => {
            cat.isChecked = false;
            return cat;
        });

        setCategories(() => [...updatedCategories]);
        setSelectedCategories(() => []);    // Clear selected categories
    };

    useEffect(() => {        
        let tempCategories = [];
        for(let cat of orgCategories) {
            let tempCategory = { ...cat, isDisplayed: cat.parent == '0' ? true : false, isChecked: false, sortIndex: 1 };
            tempCategories.push(tempCategory);
        }

        // Get all unique parent ids
        let allParentIds = [];
        tempCategories.map(cat => {
            allParentIds.push(cat.parent);
        });
        let uniqueParentIds = [...new Set(allParentIds)];
        //console.log(uniqueParentIds);

        // Add 'Select All'
        for(let parentId of uniqueParentIds){
            const childrenCount = orgCategories.filter(oc => oc.parent === parentId).length;

            if(childrenCount > 1) {
                let isAllCategory = {id: "-1", parent: parentId.toString(), name: "Select All", 
                    isDisplayed:  parentId === 0 ? true : false, isChecked: false, sortIndex: 0 };
                tempCategories.push(isAllCategory);
            }
        }

        // Sort the 'Categories'
        //tempCategories.sort((a,b) => (a.sortIndex > b.sortIndex) ? 1 : ((b.sortIndex > a.sortIndex) ? -1 : 0));        
        tempCategories.sort((a,b) => (a.sortIndex > b.sortIndex) ? 1 
            : (a.sortIndex === b.sortIndex ? ((a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                : ((b.sortIndex > a.sortIndex) ? -1 : 0)));

        setCategories(tempCategories);
    }, [orgCategories]);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);    

    return (
        <>
            <div className='d-flex flex-row w-75'>
                <div className='mt-3 mb-2 ms-5 me-5 d-inline-block ml-auto'>
                    {categories.map(category =>  (

                        category.parent === "0" && (
                            <div className='vertical-box' key={category.id}>
                                <Category key={category.id} category={category} categories={categories} 
                                    toggleCategory={toggleCategory} checkCategory={checkCategory} />
                            </div>
                        )
                    ))}
                </div>

                <div className='mt-3 mb-2 ms-5 me-5 d-inline-block w-25 ms-auto'>
                    <h4 className='mb-5'>Selected Categories</h4>

                    <ul>
                        {selectedCategories.map(category => (
                            <li key={category}>
                                <div className=' d-flex flex-row text-start'>{category}</div>

                                <div className='d-inline-block ml-auto'>
                                    <button style={{ color: 'red' }} className='delete-button' onClick={() => removeCategory(category)}>
                                        x</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>                
            </div>

            <div className='w-25'>
                <button type="button" className="mt-5 ms-1 my-2 btn btn-danger" onClick={onClickRemoveAllSelections}>Remove All</button>
            </div>
        </>
    )
}

export default Categories;

