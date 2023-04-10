import React from "react";
import "../../css/menu/subMenu.css"
import {Icon} from '@iconify/react';
import Downshift from "downshift";


const SubMenu=({title})=>{
    const items = [
        {value: 'apple'},
        {value: 'pear'},
        {value: 'orange'},
        {value: 'grape'},
        {value: 'banana'},
        {value: 'tmp1'},
        {value: 'tmp2'},
        {value: 'tmp3'},
        {value: 'tmp4'},
        {value: 'tmp5'},
        {value: 'tmp6'},
        {value: 'tmp7'},
        {value: 'tmp8'},

      ]
   
    return(  
        <Downshift
            onChange={selection =>
                alert(selection ? `${title} selected ${selection.value}` : 'Selection Cleared')
                }
            >
            {({
                getItemProps,
                getLabelProps,
                getMenuProps,
                getToggleButtonProps,
                isOpen,
                highlightedIndex,
                getRootProps,
            }) => (
            <div className="root_menu"
            {...getRootProps({}, {suppressRefError: true})}>
                <div className={isOpen?"open_menu":"close_menu"} 
                {...getToggleButtonProps()} aria-label={'toggle menu'}>
                    <label className="menu_label" {...getLabelProps()}>{title}</label>
                    <div className="menu_icon">
                    {
                        isOpen ?
                        <Icon icon="material-symbols:arrow-drop-up-rounded" height={40}/>
                        :<Icon icon="material-symbols:arrow-drop-down-rounded" height={40}/>
                    }
                    </div>
                </div>
                <div className="menu_box"
                {...getMenuProps()}>
                {isOpen ? items.map((item, index) => (
                    <div className={items.length===index+1?                 
                        "last_menu_item":"menu_item"}
                    {...getItemProps({
                      key: item.value,
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? '#3F675B': '#62847A'
                      },
                    })}>{item.value}
                    </div>)): null
                }
                </div>
            </div>
            )}
        </Downshift>
    )
}
export default SubMenu;