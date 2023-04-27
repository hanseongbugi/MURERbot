import React,{useRef,useState} from "react";
import "../../css/menu/subMenu.css"
import {Icon} from '@iconify/react';
import Downshift from "downshift";
import { BsTrash3 } from "react-icons/bs";
import { TbPencilMinus } from "react-icons/tb";
import _ from 'lodash';
import { useEffect } from "react";

const SubMenu=({title,items,setItems})=>{
    const downShiftRef = useRef(null);
    const [isTransformItem,setIsTransformItem]=useState([])
    const [transformItem, setTransformItem]=useState("")
    const [filterItems,setFilterItems] = useState([])

    const handleTransformItem = (e) => {
        setTransformItem(e.target.value)
    }
    const handleFocus = (e)=>{
        e.stopPropagation()
        e.target.focus()
    }
    const onTrashButton = (target)=>{
        setItems(items.filter((value)=>!_.isEqual(value.idx,target.idx)));
    }
    const onPencilButton = (target)=>{
        console.log(target)
        const newTransformItem= isTransformItem.map(item=>{
            if(item.idx===target.idx){
                item.type=true
            }
            return item
        })
        setIsTransformItem([...newTransformItem])
        setTransformItem(target.value)

    }
    useEffect(()=>{
        function numberDuplicates(arr) {
            const counts = {};
            const numberedArr = [];
            const transformArray=[]
            for (let i = 0; i < arr.length; i++) {
                let filterValue=Object.assign({},arr[i]) //깊은 복사
                if (filterValue.value in counts) {
                    counts[filterValue.value]++;
                    filterValue.value=`${filterValue.value} (${counts[filterValue.value]})`
                    numberedArr.push(filterValue);
                } else {
                    counts[filterValue.value] = 0;
                    numberedArr.push(filterValue);
                }
                transformArray.push({...filterValue, type:false})
            }
            setIsTransformItem([...transformArray])
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
            onOuterClick={(downShift) => downShift.openMenu()}
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
                    })}>{isTransformItem[index].type?<input value={transformItem} onClick={handleFocus} onChange={handleTransformItem}/>:(item.value.length>=14?item.value.substr(0,14)+"...":item.value)}
                    <BsTrash3 className="trash_button" onClick={(e)=>{e.stopPropagation(); onTrashButton(item)}}/>
                    <TbPencilMinus onClick={(e)=>{e.stopPropagation(); onPencilButton(item)}} className="pencil_button"/>
                    </div>)): null
                }
                </div>
            </div>
            )}
        </Downshift>
    )
}
export default SubMenu;