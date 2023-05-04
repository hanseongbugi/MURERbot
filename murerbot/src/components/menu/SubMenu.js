import React,{useRef,useState} from "react";
import "../../css/menu/subMenu.css"
import {Icon} from '@iconify/react';
import Downshift from "downshift";
import { BsTrash3 } from "react-icons/bs";
import { TbPencilMinus } from "react-icons/tb";
import _ from 'lodash';
import { useEffect } from "react";
import axios from "axios";

const SubMenu=({title,items,setItems,userId,scrollbarRef})=>{
    const downShiftRef = useRef(null);
    const [isTransformItem,setIsTransformItem]=useState([])
    const [transformItem, setTransformItem]=useState("")
    const [filterItems,setFilterItems] = useState([])
    const [isComposing, setIsComposing]=useState(false);


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
        console.log(e)
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
            const res = await axios.post(
            `${userId}/manageBookmark`,
            inputData
          );
          console.log(res)
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
            const res = await axios.post(
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
        console.log(items)
        // 북마크 삭제
        sendBookmark2Server(false, target.idx, target.value)
    }
    const onPencilButton = (target)=>{
        //console.log(target)
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

    const scrollToBubble = (idx) => {
        var selectorId = ".chat_row" + idx
        var bubble = document.querySelector(selectorId);
        scrollbarRef.current.scrollTop(bubble.offsetTop-100);
    }
    const itemLength = (item)=>{
        let length = 0 
        const hangulPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글
        for(let i = 0;i<item.length; i++){
            //console.log(item[i])
            if(hangulPattern.test(item[i])){
                length += 2;
            }
            length += 1;
        }
        return length
    }
    const itemSubStr = (item,start,end)=>{
        if(start<0||end>itemLength(item))return
        let length = 0 
        let tmpStr = ""
        const hangulPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글
        for(let i = start;i<item.length;i++){
            if(length >= end) break;
            if(hangulPattern.test(item[i])){
                length += 2
            }
            length += 1
            tmpStr += item[i]
        }
        return tmpStr
    }

    return(  
        <Downshift ref={downShiftRef}
            onSelect={selection =>selection ? scrollToBubble(selection.idx) : 'Selection Cleared'}
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
                        "last_menu_item":"menu_item"}
                    {...getItemProps({
                      key: item.value,
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? '#3F675B': '#62847A'
                      },
                    })}>{isTransformItem[index].type?
                    <input className="transform_input" type="text" autoFocus value={transformItem} onBlur={(e)=>{e.stopPropagation(); saveTransformItem(item)}} 
                    onDrag={handleDrag} onClick={handleFocus} onKeyDown={(e)=>enterKey(e,item)} onChange={handleTransformItem} onCompositionStart={()=>setIsComposing(true)} 
                    onCompositionEnd={()=>setIsComposing(false)}/>:
                    (itemLength(item.value)>30?itemSubStr(item.value,0,30)+"...":item.value)}
                    <BsTrash3 className="trash_button" size={20} onClick={(e)=>{e.stopPropagation(); onTrashButton(item)}}/>
                    <TbPencilMinus size={20} onClick={(e)=>{e.stopPropagation(); onPencilButton(item)}} className="pencil_button"/>
                    </div>)): null
                }
                </div>
            </div>
            )}
        </Downshift>
    )
}
export default SubMenu;