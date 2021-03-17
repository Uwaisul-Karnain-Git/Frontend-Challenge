
const Category = ({ category, categories, toggleCategory, checkCategory }) => {

    return (        
        <div className='vertical-div mt-4 ms-5' key={category.id}>

            <div className='d-flex'>
                <input className='ms-5' type='checkbox' checked={category.isChecked ? 'checked': ''}                     
                    onChange={() => checkCategory(category.id, category)} />
                <h4 className='ms-3' onClick={() => toggleCategory(category.id)}>{category.name}</h4>
            </div>
            

            {categories.map(cat => (                
                cat.parent === category.id && cat.isDisplayed &&                
                    <Category key={cat.id} category={cat} categories={categories} 
                        toggleCategory={toggleCategory} checkCategory={checkCategory}/>
            ))}
        </div>
    )
}

export default Category;


