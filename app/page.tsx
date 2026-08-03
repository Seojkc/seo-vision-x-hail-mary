import Welcome from './Sections/welcome'
import Theory from './Sections/stringTheory'
import Introduction from './Sections/Introduction';
import GraceToDoor from './Sections/graceToDoor';
import  Funfacts from './Sections/funFacts'

export default function Home() {
  return (
    <div>
      
      <Welcome />
      <Introduction/>

      <GraceToDoor/>
      
      <Funfacts/>
      
      <Theory/>

      
    </div>
  );
}
