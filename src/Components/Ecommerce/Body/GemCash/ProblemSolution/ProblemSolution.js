// Dentro de src/Components/ClientView/Body/GemCash/ProblemSolution/ProblemSolution.js

import React from 'react';
import './ProblemSolution.css';

const ProblemSolution = ({ data }) => {

    // Se a prop 'data' ainda não chegou, não renderiza nada para evitar erros.
    if (!data) {
        return null;
    }

    // Ícones padrão que serão usados no componente, independentemente do que vier do admin.
    const traditionalIcons = ["fas fa-chart-line", "fas fa-cloud", "fas fa-file-invoice-dollar"];
    const solutionIcons = ["fas fa-shield-alt", "fas fa-gem", "fas fa-search-dollar"];

    return (
        <section className="ps-section">
            <div className="ps-container">
                <div className="ps-intro">
                    <h1 className="ps-main-title fonte-principal">{data.mainTitle}</h1>
                    <p className="ps-subtitle">{data.subtitle}</p>
                </div>
                
                <div className="comparison-wrapper">
                    {/* Coluna 1: O Problema (Ativo Tradicional) */}
                    <div className="comparison-card traditional">
                        <h3 className="card-title">{data.traditionalTitle}</h3>
                        <ul className="features-list">
                            {/* Garante que o array exista antes de mapear com '(data.traditionalPoints || [])' */}
                            {(data.traditionalPoints || []).map((point, index) => (
                                <li className="feature-item problem" key={index}>
                                    {/* Usa o ícone correspondente do array de ícones padrão */}
                                    <i className={traditionalIcons[index] || "fas fa-times-circle"}></i>
                                    <div>
                                        <h4>{point.title}</h4>
                                        <p>{point.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coluna 2: A Solução (GemCash) */}
                    <div className="comparison-card solution">
                        <h3 className="card-title">{data.solutionTitle}</h3>
                        <ul className="features-list">
                            {(data.solutionPoints || []).map((point, index) => (
                                <li className="feature-item success" key={index}>
                                    {/* Usa o ícone correspondente do array de ícones padrão */}
                                    <i className={solutionIcons[index] || "fas fa-check-circle"}></i>
                                    <div>
                                        <h4>{point.title}</h4>
                                        <p>{point.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;