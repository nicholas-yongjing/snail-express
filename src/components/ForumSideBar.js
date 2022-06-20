
export default function ForumSideBar() {


    function handleClick(thread) {

    }

    return (
        <div
            className='d-flex flex-column align-items-stretch gap-3 p-4 bg-secondary fs-4'
            style={{height: '100vh', width: 'min(400px, 25vw)'}}
        >
            {
                [['General'],
                ['Lectures'],
                ['Admin']].map((thread) => {
                    return (
                        <div
                            key={thread[0]}
                            onClick={handleClick(thread)}
                            style={{cursor: 'pointer'}}
                            className='text-white'
                        >
                            {thread[0]}
                        </div>
                    );
                })
            }
        </div>

    );
}