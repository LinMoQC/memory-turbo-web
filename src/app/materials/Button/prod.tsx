import { CommonComponentProps } from '@/types/editor';
import { Button as AntdButton } from 'antd';

const Button = ({ id, type, text, styles,...props }: CommonComponentProps) => {
    return (
        <AntdButton type={type} id='id' style={styles} {...props}>{text}</AntdButton>
    )
}

export default Button;
