import React, { useReducer, useContext, useEffect, useRef } from 'react'



function appReducer(state, action) {

    console.log( action.texto)

    switch (action.type) {
        case 'reset':
            return action.payload;
        case 'add': {
            return [
                ...state,
                {
                    id: Date.now(),
                    text: "",
                    completed: false,
                }
            ]
        }
        case 'text':


            return state.map(item =>{
                if( item.id === action.payload ){
                    
                  
                        
                 return {...item, text:action.texto}
                }
                return item
            })
        case 'delete':
            return state.filter(item => item.id !== action.payload)
        case 'completed':
            return state.map(item => {
                if (item.id === action.payload) {
                    return { ...item, completed: !item.completed }
                }
                return item
            })

        default: {
            return state;
        }

    }
}

const Context = React.createContext();

function useEffectOnce(cb) {
    const didRun = useRef(false)

    useEffect(() => {

        if (!didRun.current) {
            cb()
            didRun.current = true;
        }

    })
    
}

export default function TodoApp() {
    const [state, dispatch] = useReducer(appReducer, [])


    useEffectOnce(()=>{
        const raw = localStorage.getItem('data');
        dispatch({ type: 'reset', payload: JSON.parse(raw) })
    })

    useEffect(
        () => {
            localStorage.setItem('data', JSON.stringify(state))
        },
        [state]
    )


    return (
        <Context.Provider value={dispatch}

        >
            <h1>Todos App</h1>
            <button onClick={() => dispatch({ type: 'add' })}>New Todo</button>
            <br /><br />
            <TodoList items={state} dispatch={dispatch} />
        </Context.Provider>
    )
}


function TodoList({ items }) {
    return items.map(item => <TodoItem key={item.id}  {...item} />)


}

function TodoItem({ id, completed, text }) {
    const dispatch = useContext(Context)
    return (
        <div
            style={{
                display: 'flex',
                msFlexDirection: 'row',
                justifyContent: 'space-between',
                maxWidth: '15rem',
                margin: '.5rem'
            }}

        >
            <input type="checkbox" checked={completed}  onChange={() => dispatch({ type: 'completed', payload: id })} />
            <input type="text" value={text}  onChange={(e) => {
                
           
                console.log(e.target.value);
                
                dispatch({ type: 'text', payload: id , texto: e.target.value  })}} />
            <button onClick={() => dispatch({ type: 'delete', payload: id })} >Delete</button>

        </div>

    )
}