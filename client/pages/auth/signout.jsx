import useRequest from '../../hooks/use-request'
import Router from 'next/router'
import { useEffect } from 'react'


export const Signout = () => {
    const { errors, doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        onSuccess: () => Router.push('/')
    })

    useEffect(() => {
        doRequest()
    }, [])

    return <div>Signing you out...</div>
}

export default Signout