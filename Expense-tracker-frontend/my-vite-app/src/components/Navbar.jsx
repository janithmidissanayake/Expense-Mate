import  { useState } from 'react';
import { Menu } from 'antd';

const items = [
  {
    label: 'How it works',
    key: 'work',
  },
  {
    label: ' about us',
    key: 'aboutUs',
   
  },
  {
    label: 'Blogs',
    key: 'blogs',
   
  },
  {
    key: 'information',
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
       Information      </a>
    ),
  },
];

const Navbar = () => {
    const [current, setCurrent] = useState('work');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} className='bg-transparent p-2'/>
  )
}

export default Navbar