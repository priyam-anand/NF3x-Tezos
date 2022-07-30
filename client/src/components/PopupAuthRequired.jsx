import { makeStyles } from '@mui/styles';
import { Chip } from '@mui/material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const useStyles = makeStyles({
    root: {
        width: "660px"
    }
});

const PopupAuthRequired = () => {
  const classes = useStyles();

  return (
    <div className={`${classes.root}`}>
      <div className='center' style={{padding: "50px 0"}}>
        <svg width="135" height="75" viewBox="0 0 135 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M130.715 29.4451H108.224C106.998 29.4451 106 28.4503 106 27.2225C106 25.9947 106.998 25 108.224 25H128.493C129.72 25 130.715 25.9947 130.715 27.2225V29.4451Z" stroke="#FF0083" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M131.062 29.4432H128.491H108.604H108.224C106.996 29.4432 106 28.4485 106 27.2207V48.8748C106 50.6 107.4 51.9983 109.124 51.9983H131.062C132.787 51.9983 134.185 50.6 134.185 48.8748V32.5667C134.185 30.8416 132.787 29.4432 131.062 29.4432Z" stroke="#FF0083" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M129.809 40.8076C129.809 41.8322 128.979 42.6621 127.954 42.6621C126.931 42.6621 126.101 41.8322 126.101 40.8076C126.101 39.783 126.931 38.9531 127.954 38.9531C128.979 38.9531 129.809 39.783 129.809 40.8076Z" stroke="#FF0083" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M45.141 41.3418C45.9053 43.651 45.2021 46.2742 43.3087 48.1962L19.5925 72.7867L15.5406 68.8673L39.2466 44.287C39.3077 44.2258 39.4504 44.0811 39.3689 43.8345C39.2874 43.5879 39.0978 43.5879 39.0163 43.5879L45.141 41.3418Z" fill="url(#paint0_linear_564_7632)"/>
            <path d="M9.85791 66.0485L9.91702 65.9486L23.7073 43.5898H30.3946L15.0125 68.5289C14.9269 68.6879 14.9493 68.7328 14.9697 68.7715L9.85791 66.0485Z" fill="url(#paint1_linear_564_7632)"/>
            <path d="M26.9197 6.00242C26.8504 6.00242 26.7057 6.00242 26.457 6.25312L6.19754 26.6532C6.1364 26.7143 5.99372 26.8591 6.07525 27.1057L0.303142 29.5943C-0.463211 27.2769 0.248112 24.6415 2.15788 22.7175L22.4173 2.3174C23.9011 0.823422 25.7681 0 27.6717 0L26.9197 6.00242Z" fill="url(#paint2_linear_564_7632)"/>
            <path d="M12.2937 41.1375C13.1253 42.6702 14.7212 43.5853 16.5657 43.5853H23.7095H30.3968H39.0162C39.0977 43.5853 45.1409 41.3413 45.1409 41.3413C44.3746 39.0239 42.316 37.5849 39.7683 37.5849H34.0981H27.4109H18.0699L20.4056 33.3496H13.8814L12.4507 35.9442L12.4364 35.9707C11.5151 37.6726 11.4621 39.6048 12.2937 41.1375Z" fill="url(#paint3_linear_564_7632)"/>
            <path d="M22.7067 27.3503L32.6937 9.2472L32.708 9.2207C33.8433 7.12138 33.9248 4.86308 32.9281 3.02873C31.9152 1.16176 29.9014 0 27.6717 0L26.9176 6.00242C27.1479 6.00242 27.4067 6.15732 27.5168 6.36318C27.5738 6.46713 27.6207 6.60572 27.4556 6.91349L16.1825 27.3503H22.7067Z" fill="url(#paint4_linear_564_7632)"/>
            <path d="M5.67597 33.3487H12.8728H19.397H29.0151L26.4022 37.584H33.0894L34.6242 35.0954L34.6833 34.9955C35.6494 33.3079 35.7411 31.3737 34.9299 29.8226C34.1187 28.2716 32.5309 27.3462 30.6823 27.3462H22.709H16.1848H6.4301C6.34857 27.3462 6.15902 27.3462 6.07749 27.0996L0.303345 29.5923C1.0697 31.9097 3.12825 33.3487 5.67597 33.3487Z" fill="url(#paint5_linear_564_7632)"/>
            <path d="M19.5923 72.7852C18.1758 74.212 16.3944 74.9987 14.5763 74.9987C12.4159 74.9987 10.4817 73.8634 9.52575 72.0352C8.58615 70.2396 8.70844 68.0567 9.86001 66.043L14.9717 68.768C15.0431 68.9046 15.2143 68.9942 15.3305 68.9942C15.3488 68.9942 15.4059 68.9942 15.5404 68.8638L19.5923 72.7852Z" fill="url(#paint6_linear_564_7632)"/>
            <defs>
            <linearGradient id="paint0_linear_564_7632" x1="11.8756" y1="75.3386" x2="40.9533" y2="46.339" gradientUnits="userSpaceOnUse">
            <stop stop-color="#00D7BE"/>
            <stop offset="0.1958" stop-color="#42D68D"/>
            <stop offset="0.4125" stop-color="#85D55B"/>
            <stop offset="0.6093" stop-color="#B9D534"/>
            <stop offset="0.779" stop-color="#DFD418"/>
            <stop offset="0.9149" stop-color="#F6D406"/>
            <stop offset="1" stop-color="#FFD400"/>
            </linearGradient>
            <linearGradient id="paint1_linear_564_7632" x1="13.3478" y1="67.2456" x2="23.7033" y2="43.8894" gradientUnits="userSpaceOnUse">
            <stop stop-color="#00D7BE"/>
            <stop offset="1" stop-color="#1F93FF"/>
            </linearGradient>
            <linearGradient id="paint2_linear_564_7632" x1="2.43106" y1="27.0483" x2="24.6021" y2="3.07272" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FF3DC8"/>
            <stop offset="1" stop-color="#FF9736"/>
            </linearGradient>
            <linearGradient id="paint3_linear_564_7632" x1="29.8431" y1="44.8799" x2="16.0869" y2="12.3562" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFD500"/>
            <stop offset="1" stop-color="#EC6047"/>
            </linearGradient>
            <linearGradient id="paint4_linear_564_7632" x1="33.6289" y1="43.2797" x2="19.8726" y2="10.7559" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFD500"/>
            <stop offset="1" stop-color="#FF9736"/>
            </linearGradient>
            <linearGradient id="paint5_linear_564_7632" x1="28.9441" y1="33.5137" x2="7.48301" y2="24.7778" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1F93FF"/>
            <stop offset="1" stop-color="#FF3DC8"/>
            </linearGradient>
            <linearGradient id="paint6_linear_564_7632" x1="10.3065" y1="73.764" x2="39.3837" y2="44.765" gradientUnits="userSpaceOnUse">
            <stop stop-color="#00D7BE"/>
            <stop offset="0.1958" stop-color="#42D68D"/>
            <stop offset="0.4125" stop-color="#85D55B"/>
            <stop offset="0.6093" stop-color="#B9D534"/>
            <stop offset="0.779" stop-color="#DFD418"/>
            <stop offset="0.9149" stop-color="#F6D406"/>
            <stop offset="1" stop-color="#FFD400"/>
            </linearGradient>
            </defs>
        </svg>
      </div>

      <span className='neutral2-text font-18 center block-elem'>You must autheticate with your wallet in order to swap this item.</span>

      <div className='flex-justify align-center outline-border radius-10' style={{margin: "40px auto 40px auto", width: "478px", justifyContent: "flex-start"}}>
          <Chip label={""} sx={{flex: "0 0 33px", marginLeft: "20px", marginRight: "31px", background: "#C4C4C4"}}/>
          <div className='section-block-margin-all-20'>
            <span className='neutral2-text font-bold-18 block-elem'>Signature request</span>
            <span className='neutral2-text font-18 block-elem'>Confirm the transaction in your wallet</span>
          </div>
      </div>
    </div>
  );
}

export default PopupAuthRequired;