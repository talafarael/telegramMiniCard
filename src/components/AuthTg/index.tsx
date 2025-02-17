import React, { useEffect } from 'react'
import {
  retrieveLaunchParams,
  useLaunchParams,
} from "@telegram-apps/sdk-react";

export interface IAuthTg {
  setLaunchParams: React.Dispatch<React.SetStateAction<any>>
  setLp: React.Dispatch<React.SetStateAction<any>>
}
export const AuthTg: React.FC<IAuthTg> = ({ setLaunchParams, setLp }) => {
  const lp = useLaunchParams();
  const launchParams = retrieveLaunchParams();
  useEffect(() => {
    setLp(lp)
  }, [lp])
  useEffect(() => {
    if (launchParams?.initDataRaw) { setLaunchParams(launchParams) }
  }, [launchParams])

  return (
    <div>

    </div>
  )
}
