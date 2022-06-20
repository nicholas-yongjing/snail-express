import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import SideBar from "../components/SideBar";

export default function SettingsGeneral() {
    const sidebarLinks = [['/settings-general', 'General'],
    ['/settings-forums', 'Forum'],
    ];
    return (
        <>
            <NavigationBar />
            <div className="d-flex">
                <SideBar links={sidebarLinks} />
                <div className="w-100 p-4">
                    <div className="d-flex justify-content-between">
                        <h1>
                            General Settings
                        </h1>
                        <Link to="/class-dashboard">
                            <button className='btn btn-secondary fs-4'>
                                Back to class dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}