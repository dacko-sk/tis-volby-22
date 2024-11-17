import React from 'react';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';

import { elections as el, labels, links } from '../../api/constants';
import { nl2r } from '../../api/helpers';

import iconL96 from '../../assets/img/icons/96money.png';
import iconE96 from '../../assets/img/icons/96eu.png';
import iconN96 from '../../assets/img/icons/96national.png';
import iconP96 from '../../assets/img/icons/96president.png';
import iconR96 from '../../assets/img/icons/96regional.png';

function IconContent({ icon, label }) {
    return (
        <>
            <img src={icon} />
            <span className="mt-2 mt-sm-3">{nl2r(label)}</span>
        </>
    );
}

function SiteNavigator({ site }) {
    const icons = {
        landing: iconL96,
        eu: iconE96,
        national: iconN96,
        president: iconP96,
        regional: iconR96,
    };
    return (
        <div id="site-navigator">
            <h2 className="text-white mb-3">{labels.sitesTitle}</h2>
            <Row>
                <Col xs={6} sm={4} lg>
                    <a href="/" className="sn-icon">
                        <IconContent
                            icon={icons.landing}
                            label={labels.sites.root}
                        />
                    </a>
                </Col>
                {[
                    [el.s22, icons.regional, labels.sites.regional],
                    [[el.n23, el.n20], icons.national, labels.sites.national],
                    [[el.p24, el.p19], icons.president, labels.sites.president],
                    [el.e24, icons.eu, labels.sites.european],
                ].map(([key, icon, label]) => {
                    const isDropdown = Array.isArray(key);
                    return (
                        <Col key={key} xs={6} sm={4} lg>
                            {isDropdown ? (
                                <Dropdown
                                    className="h-100"
                                    drop="down-centered"
                                >
                                    <Dropdown.Toggle
                                        className="sn-icon"
                                        variant="transparent"
                                    >
                                        <IconContent
                                            icon={icon}
                                            label={label}
                                        />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {key.map((di) => (
                                            <Dropdown.Item
                                                key={di}
                                                href={links[di]}
                                                active={site === di}
                                            >
                                                {labels.elections[di]}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <a href={links[key]} className="sn-icon">
                                    <IconContent icon={icon} label={label} />
                                </a>
                            )}
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}

export default SiteNavigator;
