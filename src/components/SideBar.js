import { Link } from 'react-router-dom';

export default function SideBar(props) {
    return (
        <div
            className='d-flex flex-column align-items-stretch gap-3 p-4 bg-secondary p-2'
            style={{width: 'min(400px, 25vw)'}}>
            {
                props.links.map(([link, text]) => {
                    return (
                        <Link
                            to={link}
                            key={text}
                            className='d-flex justify-content-center'
                        >
                            <button type='button' className='btn w-100 btn-primary align-self-center'>
                                {text}
                            </button>
                        </Link>
                    );
                })
            }
        </div>

    );
}