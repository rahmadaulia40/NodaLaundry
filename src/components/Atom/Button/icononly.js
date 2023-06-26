import React from 'react';
import {TouchableOpacity} from 'react-native';
import { IconBackDark, IconBackLight } from '../../../assets';

const IconOnly = ({icon, onPress}) => {
    const Icon =()=>{
        if (icon === 'back-dark')
        {
            return <IconBackDark/>
        }
        else if (icon === 'back-light')
        {
            return <IconBackLight/>
        }
        else
        {
            return <IconBackDark/>
        }
    }
  return (
      <TouchableOpacity onPress={onPress}>
          <Icon/>
      </TouchableOpacity>
  )
}

export default IconOnly