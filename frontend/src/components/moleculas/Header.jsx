import { Sidebar } from "../organismos/Sidebar.jsx";
import { SideBarUser } from "../organismos/SideBarUser.jsx";

const Header = (props) => {
    return(
        <div className="bg-[#dc7633] w-full h-20 flex justify-between shadow-3xl shadow-gray-900 border-b-2 border-gray-300">
            <Sidebar />
            <h2 className="text-white text-2xl font-bold flex items-center">
                {props.title}
            </h2>
            <SideBarUser />
        </div>
    )
}

export default Header;