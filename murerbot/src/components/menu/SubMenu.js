import React,{useRef,useState} from "react";
import "../../css/menu/subMenu.css"
import {Icon} from '@iconify/react';
import Downshift from "downshift";
import { BsTrash3,BsCheckLg } from "react-icons/bs";
import { TbPencilMinus } from "react-icons/tb";
import _ from 'lodash';
import { useEffect } from "react";
import axios from "axios";

const SubMenu=({title,items,setItems,userId,scrollbarRef,shakeBubble,setShakeBubble})=>{
    const downShiftRef = useRef(null);
    const [isTransformItem,setIsTransformItem]=useState([])
    const [transformItem, setTransformItem]=useState("")
    const [filterItems,setFilterItems] = useState([])
    const [isComposing, setIsComposing]=useState(false);
    const [showIcon,setShowIcon] = useState([])
    const [showCheckIcon,setShwoCheckIcon] = useState([])

    const handleTransformItem = (e) => {
        setTransformItem(e.target.value)
    }
    const handleFocus = (e)=>{
        e.stopPropagation()
        e.preventDefault()
        e.target.focus()
        e.target.select()
    }
    const handleDrag = (e)=>{
        e.preventDefault()
        //console.log(e)
        e.target.setSelectionRange(0, 1)
    }
    async function sendBookmark2Server(isAdd, logId, bookmarkTitle) {
        // isAdd => 추가할 북마크인지 삭제할 북마크인지
        try{
            var inputData = {}
            if(isAdd){ // 북마크 추가
                inputData =  { state:"ADD_BM",
                "userId":userId,
                "logId":logId,
                "title":bookmarkTitle}
            }
            else{ // 북마크 삭제
                inputData =  {state:"DELETE_BM",
                "userId":userId,
                "logId":logId,
                "title":bookmarkTitle}
            }
            await axios.post(
            `${userId}/manageBookmark`,
            inputData
          );
          //console.log(res)
        } catch(e) {
            console.error(e)
        }
    }

    async function modifyBookmark2Server(logId, bookmarkTitle) {
        // isAdd => 추가할 북마크인지 삭제할 북마크인지
        try{
            const inputData = {"state":"MODIFY_BM",
                "userId":userId,
                "logId":logId,
                "title":bookmarkTitle}
            await axios.post(
            `${userId}/manageBookmark`,
            inputData
          );
          //console.log(res)
        } catch(e) {
            console.error(e)
        }
        
    }
    const saveTransformItem = (target)=>{
        if(transformItem.length===0)return;
        const saveItems = items.map((value)=>{
            if(_.isEqual(value.idx,target.idx)){
                let filterValue=Object.assign({},value) //깊은 복사
                filterValue.value = transformItem
                modifyBookmark2Server(filterValue["idx"], filterValue["value"])
                return filterValue
            }
            return value
        })
        
        setItems([...saveItems])
    }
    const enterKey=(e,target)=>{
        if(isComposing) return;
        if(transformItem.length===0)return;
        if(e.key==='Enter'){
            const saveItems = items.map((value)=>{
                if(_.isEqual(value.idx,target.idx)){
                    let filterValue=Object.assign({},value) //깊은 복사
                    filterValue.value = transformItem
                    modifyBookmark2Server(filterValue["idx"], filterValue["value"])
                    return filterValue
                }
                return value
            })
            setItems([...saveItems])
        }
    }

    const onTrashButton = (target)=>{
        setItems(items.filter((value)=>!_.isEqual(value.idx,target.idx)));
        //console.log(items)
        // 북마크 삭제
        sendBookmark2Server(false, target.idx, target.value)
    }
    const onPencilButton = (target,index)=>{
        //console.log(target)
        const newTransformItem= isTransformItem.map(item=>{
            if(item.idx===target.idx){
                item.type=true
            }
            return item
        })
        setIsTransformItem([...newTransformItem])
        setTransformItem(target.value)
        const filterIcon = showIcon.map((value)=>false)
        //console.log(filterIcon)
        setShowIcon([...filterIcon])
        const filterCheckIcon = showCheckIcon.map((value,idx)=>idx===index?true:false)
        //console.log(filterCheckIcon)
        setShwoCheckIcon([...filterCheckIcon])
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
        //console.log(items)
        setFilterItems(numberDuplicates(items))
    },[items])
    useEffect(()=>{
        let iconArray = []
        //console.log(filterItems)
        for(let i=0;i<filterItems.length;i++)
            iconArray.push(false)
        setShowIcon([...iconArray])
        setShwoCheckIcon([...iconArray])
    },[filterItems])

    const scrollToBubble = (selection) => {
        var selectorId = ".chat_row" + selection.idx
        var bubble = document.querySelector(selectorId);
        scrollbarRef.current.scrollTop(bubble.offsetTop-100);
        console.log(selection)
        const shakeIndex = selection.idx
        // const shakeArray = isShake.map((value,idx)=> idx===shakeIndex? true: false)
        // console.log(shakeArray)
        // console.log(shakeIndex)
        setShakeBubble(shakeIndex)
        setTimeout(()=>setShakeBubble(null),500)
    }
    const showSubMenuIcon = (e,index)=>{
        e.preventDefault()
        if(isTransformItem[index].type)return;
        const filterIcon = showIcon.map((value,idx)=>idx===index?true:false)
        setShowIcon([...filterIcon])
    }
    const deleteSubMenuIcon = (e,index)=>{
        e.preventDefault()
        if(showCheckIcon[index])return;
        const filterIcon = showIcon.map((value)=>false)
        setShowIcon([...filterIcon])
    }
    return(  
        <Downshift ref={downShiftRef}
            onSelect={selection =>selection ? scrollToBubble(selection) : 'Selection Cleared'}
            itemToString={item=>(item ? String(item.value) : '')}
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
                                "last_menu_item":"menu_item"} onMouseEnter={(e)=>showSubMenuIcon(e,index)} onMouseLeave={(e)=>deleteSubMenuIcon(e,index)}
                            {...getItemProps({
                            key: item.value,
                            index,
                            item,
                            style: {
                                backgroundColor:
                                highlightedIndex === index ? '#3F675B': '#62847A'
                            },
                        })}>
                            {isTransformItem[index].type?
                            <input className="transform_input" type="text" autoFocus value={transformItem} onBlur={(e)=>{e.stopPropagation(); saveTransformItem(item)}} 
                            onDrag={handleDrag} onClick={handleFocus} onKeyDown={(e)=>enterKey(e,item)} onChange={handleTransformItem} onCompositionStart={()=>setIsComposing(true)} 
                            onCompositionEnd={()=>setIsComposing(false)}/>:<div>{item.value}</div>}
                            {showIcon[index]?<TbPencilMinus className="pencil_button" size={20} onClick={(e)=>{e.stopPropagation(); e.preventDefault(); onPencilButton(item,index)}} />:null}
                            {showCheckIcon[index]?<BsCheckLg className="pencil_button" size={20}  onClick={(e)=>{e.stopPropagation(); e.preventDefault(); saveTransformItem(item)}} />:null}
                            {showIcon[index]||showCheckIcon[index]?<BsTrash3 className="trash_button" size={20} onClick={(e)=>{e.stopPropagation(); e.preventDefault(); onTrashButton(item)}}/>:null}
                        </div>)): null
                    }
                </div>
            </div>
            )}
        </Downshift>
    )
}
export default SubMenu;