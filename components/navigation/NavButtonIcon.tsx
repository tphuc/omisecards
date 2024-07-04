import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

interface NavButtonIconProps {
    href: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    lightColor?: string;
    darkColor?: string;
  }

const NavButtonIcon: React.FC<NavButtonIconProps> = ({
    href,
    iconName = 'add',
    iconSize = 28,
  }) => {
    const color = useThemeColor({ }, 'text');
  
    return (
      <TouchableOpacity activeOpacity={0.9}>
        <Link href={href} asChild>
          <Ionicons size={iconSize} name={iconName} color={color} />
        </Link>
      </TouchableOpacity>
    );
  };
  
  export default NavButtonIcon;