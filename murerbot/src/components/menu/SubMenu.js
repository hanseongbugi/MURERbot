import React,{useRef,useState} from "react";
import "../../css/menu/subMenu.css"
import {Icon} from '@iconify/react';
import Downshift from "downshift";
import { BsTrash3 } from "react-icons/bs";
import _ from 'lodash';
import { useEffect } from "react";

const SubMenu=({title,items,setItems})=>{
    const downShiftRef = useRef(null);
    const [filterItems,setFilterItems] = useState([])
    const onTrashButton = (target)=>{
        setItems(items.filter((value)=>!_.isEqual(value.idx,target.idx)));
    }

    useEffect(()=>{
        function numberDuplicates(arr) {
            const counts = {};
            const numberedArr = [];
            
            for (let i = 0; i < arr.length; i++) {
                let filterValue=Object.assign({},arr[i]) //깊은 복사
              
                if (filterValue in counts) {
                    counts[filterValue]++;
                    filterValue.value=`${filterValue.value} (${counts[filterValue]})`
                    numberedArr.push(filterValue);
                } else {
                    counts[filterValue] = 0;
                    numberedArr.push(filterValue);
                }
            }
            
            return numberedArr;
        }
        //setFilterItems([...items])
        setFilterItems(numberDuplicates(items))
    },[items])
    return(  
        <Downshift ref={downShiftRef}
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
                setHighlightedIndex,
                getRootProps,
            }) => (
            <div className="root_menu"
            {...getRootProps({}, {suppressRefError: true})}>
                <div className={isOpen&&filterItems.length!==0?"open_menu":"close_menu"} 
                {...getToggleButtonProps()} aria-label={'toggle menu'}>
                    <label className="menu_label" {...getLabelProps()}>{title}</label>
                    <div className="menu_icon">
                    {
                        isOpen&&filterItems.length!==0?
                        <Icon icon="material-symbols:arrow-drop-up-rounded" width={40}/>
                        :<Icon icon="material-symbols:arrow-drop-down-rounded" width={40}/>
                    }
                    </div>
                </div>
                <div className="menu_box"
                {...getMenuProps({ onMouseLeave: ()=>setHighlightedIndex(-1)})}>
                {isOpen ? filterItems.map((item, index) => (
                    <div className={filterItems.length===index+1?                 
                        "last_menu_item":"menu_item"}
                    {...getItemProps({
                      key: item.value,
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? '#3F675B': '#62847A'
                      },
                    })}>{item.value.length>=16?item.value.substr(0,16)+"...":item.value}
                    <BsTrash3 className="trash_button" onClick={(e)=>{e.stopPropagation(); onTrashButton(item)}}/>
                    </div>)): null
                }
                </div>
            </div>
            )}
        </Downshift>
    )
}
export default SubMenu;