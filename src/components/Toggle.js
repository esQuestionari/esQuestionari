import React, { useState } from "react";
import '../style/Toggle.css';

function Toggle() {
    const [isSelected, setIsSelected] = useState(false);

    return (
        <div class="container"> 
            <input type="checkbox" id="check"/>
            <label for="check" class="button"></label>
        </div>
    )
}
export default Toggle;