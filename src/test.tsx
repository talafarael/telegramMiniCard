import { useLaunchParams } from '@telegram-apps/sdk-react';
import React from 'react'

export default function Test() {
    const lp = useLaunchParams();
    console.log(lp)
  return (
    <div>test</div>
  )
}
