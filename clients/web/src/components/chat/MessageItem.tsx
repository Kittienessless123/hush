import { Card } from 'antd';

interface MessageItemProps {
  id: string;
  text: string;
  sender: string;
  time: string;
}

export const MessageItem = ({ id, text, sender, time }: MessageItemProps) => {
  const onCardClick = () => {
    console.log('clicked message:', id);
  }

  return (
    <Card 
      style={{ 
        width: 300,
        alignSelf: sender === 'me' ? 'flex-end' : 'flex-start',
        backgroundColor: sender === 'me' ? '#e6f7ff' : '#f5f5f5',
      }} 
      onClick={onCardClick}
    >
      <p>{text}</p>
      <small style={{ color: '#999' }}>{time}</small>
    </Card>
  )
}