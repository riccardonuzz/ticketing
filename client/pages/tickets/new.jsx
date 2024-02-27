import Router from 'next/router'
import React, { useState } from 'react'
import useRequest from '../../hooks/use-request'

const NewTicket = () => {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => Router.push('/')
    })

    const onBlur = () => {
        const value = parseFloat(price)

        if (isNaN(value)) {
            return
        }

        setPrice(value.toFixed(2))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        doRequest()
    }

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} name="title" type="text" className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input value={price} onBlur={onBlur} onChange={e => setPrice(e.target.value)} name="price" type="text" className="form-control" />
                </div>
                {
                    errors?.length > 0 &&
                    <div className="alert alert-danger mt-2">
                        <h4>Oooops...</h4>
                        <ul className='my-0'>
                            {errors.map(error => <li key={error.message}>{error.message}</li>)}
                        </ul>
                    </div>
                }
                <button type="submit" className="btn btn-primary mt-2">Submit</button>
            </form>
        </div>
    )
}

export default NewTicket