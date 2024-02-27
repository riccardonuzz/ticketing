import React, { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const Signin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { errors, doRequest } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async (e) => {
        e.preventDefault()
        await doRequest()
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign in</h1>
            <div className="form-group mt-3">
                <label htmlFor='email'>Email address</label>
                <input vale={email} onChange={(e) => setEmail(e.target.value)} type="email" name='email' className='form-control' />
            </div>
            <div className="form-group">
                <label htmlFor='password'>Password</label>
                <input vale={password} onChange={(e) => setPassword(e.target.value)} type="password" name='password' className='form-control' />
            </div>
            {
                errors?.length > 0 &&
                <div className="alert alert-danger">
                    <h4>Oooops...</h4>
                    <ul className='my-0'>
                        {errors.map(error => <li key={error.message}>{error.message}</li>)}
                    </ul>
                </div>}
            <button className="btn btn-primary mt-3">Sign up</button>
        </form>
    )
}

export default Signin