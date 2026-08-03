import Welcome from './Sections/welcome'
import Theory from './Sections/stringTheory'
import Introduction from './Sections/Introduction';

export default function Home() {
  return (
    <div>
      
      <Welcome />
      <Introduction/>
      <Theory/>
      
    </div>
  );
}
