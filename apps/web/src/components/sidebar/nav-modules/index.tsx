import { NavAttendance } from "./nav-attendance";
import { NavChannels } from "./nav-communication";
import { NavOverview } from "./nav-overview";

export function NavModules() {
  return (
    <>
      <NavOverview />
      <NavAttendance />
      <NavChannels />
    </>
  );
}
