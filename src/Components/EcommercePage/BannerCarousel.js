import React from 'react';
import Slider from 'react-slick';
import style from './EcommercePageStyle.js';

const BannerCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        fade: true,
        arrows: true,
    };

    return (
        <div style={style.bannerCarousel}>
            <Slider {...settings}>
                <div>
                    <img src="../img/__4_home_tv___escritorio_com_ate_40_off___28_07_a_04_08_4812_1180x320.webp" alt="Banner 1" style={style.bannerImage} />
                </div>
                <div>
                    <img src="../img/__5_home_tv___filtros_e_purificadores_com_ate_30_off___28_07_a_04_08_ec42_1180x320.webp" alt="Banner 2" style={style.bannerImage} />
                </div>
                <div>
                    <img src="../img/__1_home_tv___48hrs_de_ferramentas_mais_vendidas_clique_e_retire_com_ate_40_off___28_07_a_30_07_073a_1180x320.webp" alt="Banner 3" style={style.bannerImage} />
                </div>
            </Slider>
        </div>
    );
};

export default BannerCarousel;