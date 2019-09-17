import React from 'react'

const Word = (props) => {
    return <div className="wordWithClose" onClick={(e) => props.wordRemove(e , props.word)}>
            <div className="wordLabel" >{props.word}</div>
            <a className="removeWord" >x</a>
         </div>
}

const WordsList = (props) => {

    if(props.words.length > 0 ){
        const listOfWords = props.words.map(word => {
            return <Word key={word} word={word} wordRemove={(e,word) => props.wordRemove(e,word)} />
        })
        return <div className="listOfBlockedWords">{listOfWords}</div>
    }else{
        return <div></div>
    }
}

export default (props) => {
    return (
        <div>
            <form onSubmit={props.onWordSubmit} autoComplete="off">
                <input className="text-input--join" placeholder="Enter Word" name="word" />
                <button className="button--join">Add</button>
                {props.words.length > 0 ? (<WordsList words={props.words} wordRemove={(e,word) => props.wordRemove(e,word)} />) : ''}
            </form>
        </div>
    )
}