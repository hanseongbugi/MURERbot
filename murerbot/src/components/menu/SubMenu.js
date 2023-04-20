import React from "react";
import "../../css/menu/subMenu.css"
import {Icon} from '@iconify/react';
import Downshift from "downshift";


const SubMenu=({title,items})=>{

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
                <div className={isOpen&&items.length!==0?"open_menu":"close_menu"} 
                {...getToggleButtonProps()} aria-label={'toggle menu'}>
                    <label className="menu_label" {...getLabelProps()}>{title}</label>
                    <div className="menu_icon">
                    {
                        isOpen&&items.length!==0?
                        <Icon icon="material-symbols:arrow-drop-up-rounded" width={40}/>
                        :<Icon icon="material-symbols:arrow-drop-down-rounded" width={40}/>
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
                    })}>{item.value.length>=30?item.value.substr(0,30)+"...":item.value}
                    </div>)): null
                }
                </div>
            </div>
            )}
        </Downshift>
    )
}
export default SubMenu;